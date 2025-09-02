"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTrackingId = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const parcel_model_1 = require("../modules/parcel/parcel.model");
const generateTrackingId = () => __awaiter(void 0, void 0, void 0, function* () {
    const today = (0, dayjs_1.default)().format("YYYYMMDD"); // 20250813
    const parcelCount = (yield parcel_model_1.Parcel.countDocuments()) + 1;
    const paddedNumber = String(parcelCount).padStart(4, "0");
    return `TRK-${today}-${paddedNumber}`;
});
exports.generateTrackingId = generateTrackingId;
