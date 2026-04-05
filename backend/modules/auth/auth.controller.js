import {
  getCurrentUserProfile,
  loginUser,
  registerUser,
} from './auth.service.js';

export const registerController = async (req, res, next) => {
  try {
    const result = await registerUser(req.body);
    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const result = await loginUser(req.body);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
};

export const meController = async (req, res, next) => {
  try {
    const result = await getCurrentUserProfile(req.user.id);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
};
