import { body } from "express-validator";

export const createStudentValidator = [
  body("firstName")
    .notEmpty()
    .withMessage("El primer nombre es requerido")
    .isString()
    .withMessage("El primer nombre debe ser una cadena de texto")
    .isLength({ max: 100 })
    .withMessage("El primer nombre no puede exceder 100 caracteres")
    .trim(),

  body("secondName")
    .optional()
    .isString()
    .withMessage("El segundo nombre debe ser una cadena de texto")
    .isLength({ max: 100 })
    .withMessage("El segundo nombre no puede exceder 100 caracteres")
    .trim(),

  body("lastName")
    .notEmpty()
    .withMessage("El primer apellido es requerido")
    .isString()
    .withMessage("El primer apellido debe ser una cadena de texto")
    .isLength({ max: 100 })
    .withMessage("El primer apellido no puede exceder 100 caracteres")
    .trim(),

  body("secondLastName")
    .optional()
    .isString()
    .withMessage("El segundo apellido debe ser una cadena de texto")
    .isLength({ max: 100 })
    .withMessage("El segundo apellido no puede exceder 100 caracteres")
    .trim(),

  body("isRetired")
    .optional()
    .isBoolean()
    .withMessage("El estado de retiro debe ser verdadero o falso")
    .toBoolean(),
];

export const updateStudentValidator = [
  body("firstName")
    .optional()
    .isString()
    .withMessage("El primer nombre debe ser una cadena de texto")
    .isLength({ max: 100 })
    .withMessage("El primer nombre no puede exceder 100 caracteres")
    .trim(),

  body("secondName")
    .optional()
    .isString()
    .withMessage("El segundo nombre debe ser una cadena de texto")
    .isLength({ max: 100 })
    .withMessage("El segundo nombre no puede exceder 100 caracteres")
    .trim(),

  body("lastName")
    .optional()
    .isString()
    .withMessage("El primer apellido debe ser una cadena de texto")
    .isLength({ max: 100 })
    .withMessage("El primer apellido no puede exceder 100 caracteres")
    .trim(),

  body("secondLastName")
    .optional()
    .isString()
    .withMessage("El segundo apellido debe ser una cadena de texto")
    .isLength({ max: 100 })
    .withMessage("El segundo apellido no puede exceder 100 caracteres")
    .trim(),

  body("isRetired")
    .optional()
    .isBoolean()
    .withMessage("El estado de retiro debe ser verdadero o falso")
    .toBoolean(),
];
