"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsultantController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const consultant_service_1 = require("./consultant.service");
let ConsultantController = class ConsultantController {
    consultantService;
    constructor(consultantService) {
        this.consultantService = consultantService;
    }
    getStats(req) {
        return this.consultantService.getStats(req.user.id);
    }
    getAssignedCases(req) {
        return this.consultantService.getAssignedCases(req.user.id);
    }
    getCaseDetails(req, id) {
        return this.consultantService.getCaseDetails(req.user.id, id);
    }
    updateStatus(req, id, body) {
        return this.consultantService.updateCaseStatus(req.user.id, id, body.status);
    }
    updateNotes(req, id, body) {
        return this.consultantService.updateCaseNotes(req.user.id, id, body.notes);
    }
    getDocuments(req, id) {
        return this.consultantService.getCaseDocuments(req.user.id, id);
    }
    verifyDocument(req, id, body) {
        return this.consultantService.verifyDocument(req.user.id, id, body.verified);
    }
};
exports.ConsultantController = ConsultantController;
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ConsultantController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('cases'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ConsultantController.prototype, "getAssignedCases", null);
__decorate([
    (0, common_1.Get)('cases/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ConsultantController.prototype, "getCaseDetails", null);
__decorate([
    (0, common_1.Patch)('cases/:id/status'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], ConsultantController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Patch)('cases/:id/notes'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], ConsultantController.prototype, "updateNotes", null);
__decorate([
    (0, common_1.Get)('cases/:id/documents'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ConsultantController.prototype, "getDocuments", null);
__decorate([
    (0, common_1.Patch)('documents/:id/verify'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], ConsultantController.prototype, "verifyDocument", null);
exports.ConsultantController = ConsultantController = __decorate([
    (0, common_1.Controller)('consultant'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('CONSULTANT'),
    __metadata("design:paramtypes", [consultant_service_1.ConsultantService])
], ConsultantController);
//# sourceMappingURL=consultant.controller.js.map