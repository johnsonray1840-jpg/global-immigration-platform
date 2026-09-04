"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const admin_crud_controller_1 = require("./admin-crud.controller");
const admin_payment_methods_controller_1 = require("./admin-payment-methods.controller");
const admin_wire_accounts_controller_1 = require("./admin-wire-accounts.controller");
const admin_approvals_controller_1 = require("./admin-approvals.controller");
const payments_module_1 = require("../payments/payments.module");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [payments_module_1.PaymentsModule],
        controllers: [
            admin_crud_controller_1.AdminCrudController,
            admin_payment_methods_controller_1.AdminPaymentMethodsController,
            admin_wire_accounts_controller_1.AdminWireAccountsController,
            admin_approvals_controller_1.AdminApprovalsController,
        ],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map