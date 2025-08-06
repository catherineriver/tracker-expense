"use strict";
'use client';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthForm = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_native_1 = require("react-native");
var _api_1 = require("@api");
var _utils_1 = require("@utils");
var BaseInput_1 = require("../BaseInput");
var BaseButton_1 = require("../BaseButton");
var AuthForm = function (_a) {
    var onSuccess = _a.onSuccess;
    var _b = (0, react_1.useState)(true), isLogin = _b[0], setIsLogin = _b[1];
    var _c = (0, react_1.useState)(''), email = _c[0], setEmail = _c[1];
    var _d = (0, react_1.useState)(''), password = _d[0], setPassword = _d[1];
    var _e = (0, react_1.useState)(''), name = _e[0], setName = _e[1];
    var _f = (0, react_1.useState)([]), errors = _f[0], setErrors = _f[1];
    var _g = (0, react_1.useState)(false), isLoading = _g[0], setIsLoading = _g[1];
    var authAPI = new _api_1.AuthAPI();
    var handleSubmit = function () { return __awaiter(void 0, void 0, void 0, function () {
        var validation, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setErrors([]);
                    setIsLoading(true);
                    validation = (0, _utils_1.validateAuth)({ email: email, password: password });
                    if (!validation.valid) {
                        setErrors(validation.errors);
                        setIsLoading(false);
                        return [2 /*return*/];
                    }
                    if (!isLogin && !name.trim()) {
                        setErrors(['Name is required']);
                        setIsLoading(false);
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, 7, 8]);
                    if (!isLogin) return [3 /*break*/, 3];
                    return [4 /*yield*/, authAPI.login({ email: email, password: password })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, authAPI.register({ email: email, password: password, name: name.trim() })];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess();
                    return [3 /*break*/, 8];
                case 6:
                    error_1 = _a.sent();
                    setErrors([error_1 instanceof Error ? error_1.message : 'An error occurred']);
                    return [3 /*break*/, 8];
                case 7:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.container, children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.title, children: isLogin ? 'Sign In' : 'Create Account' }), errors.length > 0 && ((0, jsx_runtime_1.jsx)(react_native_1.View, { style: styles.errorContainer, children: errors.map(function (error, index) { return ((0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.errorText, children: error }, index)); }) })), !isLogin && ((0, jsx_runtime_1.jsx)(BaseInput_1.BaseInput, { label: "Full Name", value: name, onChangeText: setName, placeholder: "Enter your full name" })), (0, jsx_runtime_1.jsx)(BaseInput_1.BaseInput, { label: "Email", value: email, onChangeText: setEmail, placeholder: "Enter your email", keyboardType: "email-address" }), (0, jsx_runtime_1.jsx)(BaseInput_1.BaseInput, { label: "Password", value: password, onChangeText: setPassword, placeholder: "Enter your password", secureTextEntry: true }), (0, jsx_runtime_1.jsx)(BaseButton_1.BaseButton, { title: isLogin ? 'Sign In' : 'Create Account', onPress: handleSubmit, disabled: isLoading, style: styles.submitButton }), (0, jsx_runtime_1.jsx)(BaseButton_1.BaseButton, { title: isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in', onPress: function () {
                    setIsLogin(!isLogin);
                    setErrors([]);
                }, variant: "secondary", style: styles.toggleButton })] }));
};
exports.AuthForm = AuthForm;
var styles = react_native_1.StyleSheet.create({
    container: {
        padding: 20
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 32,
        color: '#1C1C1E'
    },
    errorContainer: {
        backgroundColor: '#FFEBEE',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16
    },
    errorText: {
        color: '#D32F2F',
        fontSize: 14,
        textAlign: 'center'
    },
    submitButton: {
        marginTop: 8,
        marginBottom: 16
    },
    toggleButton: {
        marginTop: 8
    }
});
