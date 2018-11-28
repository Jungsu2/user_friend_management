"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function prepareSchemaForDocumentsOnly(templateContext) {
    var copy = Object.assign({}, templateContext);
    copy.interfaces = [];
    copy.unions = [];
    copy.types = [];
    copy.hasInterfaces = false;
    copy.hasUnions = false;
    copy.hasTypes = false;
    return copy;
}
exports.prepareSchemaForDocumentsOnly = prepareSchemaForDocumentsOnly;
//# sourceMappingURL=prepare-documents-only.js.map