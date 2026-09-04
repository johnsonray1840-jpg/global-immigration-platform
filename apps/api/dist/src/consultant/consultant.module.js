"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsultantModule = void 0;
const common_1 = require("@nestjs/common");
const consultant_service_1 = require("./consultant.service");
const consultant_controller_1 = require("./consultant.controller");
const notifications_module_1 = require("../notifications/notifications.module");
let ConsultantModule = class ConsultantModule {
};
exports.ConsultantModule = ConsultantModule;
exports.ConsultantModule = ConsultantModule = __decorate([
    (0, common_1.Module)({
        imports: [notifications_module_1.NotificationsModule],
        controllers: [consultant_controller_1.ConsultantController],
        providers: [consultant_service_1.ConsultantService],
    })
], ConsultantModule);
//# sourceMappingURL=consultant.module.js.map