"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function sanitizeFilename(name, graphQlType) {
    var cleanName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    return cleanName === '' ? cleanName : cleanName + '.' + graphQlType;
}
exports.sanitizeFilename = sanitizeFilename;
//# sourceMappingURL=sanitizie-filename.js.map