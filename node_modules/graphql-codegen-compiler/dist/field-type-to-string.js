"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getFieldTypeAsString(field) {
    if (field.isEnum) {
        return 'enum';
    }
    else if (field.isType) {
        return 'type';
    }
    else if (field.isInputType) {
        return 'input-type';
    }
    else if (field.isScalar) {
        return 'scalar';
    }
    else if (field.isInterface) {
        return 'interface';
    }
    else if (field.isUnion) {
        return 'union';
    }
    else {
        return '';
    }
}
exports.getFieldTypeAsString = getFieldTypeAsString;
//# sourceMappingURL=field-type-to-string.js.map