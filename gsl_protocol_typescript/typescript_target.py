import os.path

from gsl import lines, generate
from gsl.strings import case

from gsl_protocol.grammar.HedgehogProtocolVisitor import Field, Oneof, MandatoryParam, RepeatedParam, OptionalParam
from . import unique


def generate_code(model, root='.'):
    for mod in model.modules:
        generate_module_code(model, mod, root)


def generate_module_code(model, mod, root):
    out_file = os.path.join(root, 'hedgehog/protocol/messages', *mod.path, f'{mod.name}.ts')
    os.makedirs(os.path.dirname(out_file), exist_ok=True)

    @generate(out_file)
    def code():
        def map_params(messageClass, mandatory, repeated, optional, custom=None):
            def has(attr_caller):
                try:
                    attr_caller()
                except AttributeError:
                    return False
                else:
                    return True

            for param in messageClass.params:
                if isinstance(param, MandatoryParam) and has(lambda: param.field.typescript_spec):
                    yield mandatory(param)
                elif isinstance(param, RepeatedParam) and has(lambda: param.field.typescript_spec):
                    yield repeated(param)
                elif isinstance(param, OptionalParam) and has(lambda: [field.typescript_spec for field in param.fields]):
                    for i in range(len(param.options)):
                        yield optional(param, i)
                elif custom:
                    yield custom(param)
                else:
                    raise RuntimeError(f"Unexpected custom parameter: {param}")

        def map_params_code(messageClass, mandatory, repeated, optional, custom=None):
            for generator in map_params(messageClass, mandatory, repeated, optional, custom):
                yield from generator

        def field_names(messageClass):
            return map_params(
                messageClass,
                mandatory=lambda param: param.name,
                repeated=lambda param: param.name,
                optional=lambda param, i: param.options[i],
                custom=lambda param: param.name,
            )

        def message_class_code(messageClass):
            message = messageClass.message
            proto = message.proto

            def message_init_code():
                def init_param_strs():
                    def param_str(name, typ, default=None, repeated=False, optional=False):
                        if repeated:
                            return f"public {case(snake=name, to='camel')}: {typ}"
                        elif default is not None and default != "undefined":
                            return f"public {case(snake=name, to='camel')}: {typ} = {default}"
                        elif optional or default == "undefined":
                            return f"public {case(snake=name, to='camel')}?: {typ}"
                        else:
                            return f"public {case(snake=name, to='camel')}: {typ}"

                    def mandatory(param):
                        typescript = param.field.typescript_spec
                        return param_str(param.name, typescript.typ, typescript.default)

                    def repeated(param):
                        typescript = param.field.typescript_spec
                        return param_str(param.name, typescript.typ, typescript.default, repeated=True)

                    def optional(param, i):
                        typescript = param.fields[i].typescript_spec
                        return param_str(param.options[i], typescript.typ, typescript.default, optional=True)

                    def custom(param):
                        return f"public {param.name}"

                    yield from map_params(messageClass, mandatory, repeated, optional, custom)

                yield from lines(f"""\
    constructor({", ".join(init_param_strs())}) {{
        super();
    }}""")

            def message_parse_code():
                def init_param_strs():
                    yield from map_params(
                        messageClass,
                        mandatory=lambda param: case(snake=param.name, to='camel'),
                        repeated=lambda param: case(snake=param.name, to='camel'),
                        optional=lambda param, i: case(snake=param.options[i], to='camel'),
                        custom=lambda param: case(snake=param.name, to='camel'),
                    )

                yield from lines(f"""\

    public static parseFrom(containerMsg: ProtoContainerMessage): Message {{
        let msg = (containerMsg as any).get{case(snake=message.discriminator, to='pascal')}();""")

                yield from map_params_code(
                    messageClass,
                    mandatory=lambda param: lines(f"""\
        let {case(snake=param.name, to='camel')} = msg.get{case(snake=param.name, to='pascal')}();"""),
                    repeated=lambda param: lines(f"""\
        let {case(snake=param.name, to='camel')} = msg.get{case(snake=param.name, to='pascal')}List();"""),
                    optional=lambda param, i: lines(f"""\
        let {case(snake=param.options[i], to='camel')} = msg.get{case(snake=param.options[i], to='pascal')}();""")
                    if len(param.options) == 1 else lines(f"""\
        let {case(snake=param.options[i], to='camel')} = msg.has{case(snake=param.options[i], to='pascal')}()? msg.get{case(snake=param.options[i], to='pascal')}() : undefined;"""),
                    custom=lambda param: lines(f"""\
        // <default GSL customizable: {messageClass.name}-parse-{param.name}>
        // TODO parse custom field '{param.name}'
        let {case(snake=param.name, to='camel')} = msg.get{case(snake=param.name, to='pascal')}();
        // </GSL customizable: {messageClass.name}-parse-{param.name}>"""),
                )

                yield from lines(f"""\
        return new {messageClass.name}({", ".join(init_param_strs())});
    }}""")

            def message_serialize_code():
                yield from lines(f"""\

    public serializeTo(containerMsg: ProtoContainerMessage): void {{
        let msg = new {proto.name}_pb.{message.name}();""")

                def assignment_str(name, nested=False, repeated=False):
                    if repeated:
                        return f"msg.set{case(snake=name, to='pascal')}List(this.{case(snake=name, to='camel')});"
                    elif nested:
                        return f"msg.set{case(snake=name, to='pascal')}(this.{case(snake=name, to='camel')});"
                    else:
                        return f"msg.set{case(snake=name, to='pascal')}(this.{case(snake=name, to='camel')});"

                yield from map_params_code(
                    messageClass,
                    mandatory=lambda param: lines(f"""\
        {assignment_str(param.name, nested=param.field.nested)}"""),
                    repeated=lambda param: lines(f"""\
        {assignment_str(param.name, nested=param.field.nested, repeated=True)}"""),
                    optional=lambda param, i: lines(f"""\
        {assignment_str(param.options[i], nested=param.fields[i].nested)}""")
                    if len(param.options) == 1 else lines(f"""\
        {assignment_str(param.options[i], nested=param.fields[i].nested)}"""),
                    custom=lambda param: lines(f"""\
        // <default GSL customizable: {messageClass.name}-serialize-{param.name}>
        // TODO serialize custom field '{param.name}'
        {assignment_str(param.name)}
        // </GSL customizable: {messageClass.name}-serialize-{param.name}>"""),
                )
                yield from lines(f"""\
        (containerMsg as any).set{case(snake=message.discriminator, to='pascal')}(msg);
    }}""")

            request = messageClass.direction == "=>"
            is_async = messageClass.direction == "<-"
            complex = len(message.requestClasses if request else message.replyClasses) > 1

            decorator = "message" if complex else "RequestMsg.message" if request else "ReplyMsg.message"

            yield from lines(f"""\

@{decorator}({proto.name}_pb.{message.name}, PayloadCase.{message.discriminator.upper()})
export class {messageClass.name} extends Message {{""")

            if is_async:
                yield from lines(f"""\
    public isAsync = true;

""")

            yield from message_init_code()

            yield from lines(f"""\

    // <default GSL customizable: {messageClass.name}-extra-members />""")

            if not complex:
                yield from message_parse_code()

            yield from message_serialize_code()
            yield from lines(f"""\
}}""")

        def complex_parser_code(message, request):
            def init_param_strs(messageClass):
                yield from map_params(
                    messageClass,
                    mandatory=lambda param: param.name,
                    repeated=lambda param: param.name,
                    optional=lambda param, i: param.options[i],
                    custom=lambda param: param.name,
                )

            messageClasses = message.requestClasses if request else message.replyClasses
            proto = message.proto

            direction = "Request" if request else "Reply"
            function_name = f"parse{message.name}{direction}From"

            yield from lines(f"""\

{direction}Msg.parser(PayloadCase.{message.discriminator.upper()})(
    function {function_name}(containerMsg: ProtoContainerMessage): Message {{
        let msg = (containerMsg as any).get{case(snake=message.discriminator, to='pascal')}();""")

            for field in message.fields:
                if isinstance(field, Field):
                    if field.nested:
                        yield from lines(f"""\
        let {field.name} = msg.has{case(snake=field.name, to='pascal')}()? msg.get{case(snake=field.name, to='pascal')}() : undefined;""")
                    elif field.repeated:
                        yield from lines(f"""\
        let {field.name} = msg.get{case(snake=field.name, to='pascal')}List();""")
                    else:
                        yield from lines(f"""\
        let {field.name} = msg.get{case(snake=field.name, to='pascal')}();""")
                elif isinstance(field, Oneof):
                    for field in field.fields:
                        yield from lines(f"""\
        let {field.name} = msg.has{case(snake=field.name, to='pascal')}()? msg.get{case(snake=field.name, to='pascal')}() : undefined;""")
                else:
                    assert False

            yield from lines(f"""\
        // <default GSL customizable: {function_name}-return>
        // TODO return correct message instance""")

            for messageClass in messageClasses:
                yield from lines(f"""\
        //return new {messageClass.name}({", ".join(init_param_strs(messageClass))});""")

            yield from lines(f"""\
        return null;
        // </GSL customizable: {function_name}-return>
    }}
);""")

        yield from lines(f"""\
// tslint:disable

import {{ RequestMsg, ReplyMsg, message, PayloadCase, Message, ProtoContainerMessage }} from './index';""")
        for protoPath, protoName in unique((proto.path, proto.name)
                                           for messageClass in mod.messageClasses
                                           for proto in (messageClass.message.proto,)):
            yield from lines(f"""\
import {{ {protoName}_pb }} from '../proto{'/'.join(('',) + protoPath)}';""")
        yield from lines(f"""\

// <default GSL customizable: module-header />""")
        for messageClass in mod.messageClasses:
            yield from message_class_code(messageClass)
        for message in mod.complexMessages:
            if len(message.requestClasses) > 1:
                yield from complex_parser_code(message, request=True)
            if len(message.replyClasses) > 1:
                yield from complex_parser_code(message, request=False)