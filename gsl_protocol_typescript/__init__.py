import os.path

from gsl.yaml import YAML

from gsl_protocol import proto_target, get_model as _get_model
from gsl_protocol.grammar.HedgehogProtocolVisitor import Oneof, Field

TYPESCRIPT_PROTOCOL_MODEL = os.path.join(os.path.dirname(__file__), 'typescript.yaml')


def unique(it):
    items = set()
    for item in it:
        if item not in items:
            items.add(item)
            yield item


def get_model(model_file=None, ts_model_file=None):
    if ts_model_file is None:
        ts_model_file = TYPESCRIPT_PROTOCOL_MODEL

    with open(ts_model_file) as f:
        yaml = YAML(typ='safe')
        ts_model = yaml.load(f)

    model = _get_model(model_file)

    def get_fields(message):
        for field in message.fields:
            if isinstance(field, Field):
                yield field
            elif isinstance(field, Oneof):
                yield from field.fields

    for message in model.messages:
        full_name = '.'.join(message.qualifiedName.full_name)
        ts_fields = ts_model.get(full_name, None)
        if ts_fields:
            for field in get_fields(message):
                ts_field = ts_fields.get(field.name, None)
                if ts_field:
                    if 'default' not in ts_field:
                        ts_field.default = None
                    field.typescript_spec = ts_field

    return model


def main():
    from . import typescript_target

    model = get_model()
    root = '.'
    proto_target.generate_code(model, root)
    typescript_target.generate_code(model, root)
