import jwt from "jsonwebtoken";
import formidable from "formidable";
import Forms from "../models/formModel.js";
import bp from "../utils/bigPromise.js";

export const allowOnly = (...roles) => {
  return (req, res, next) => {
    if (roles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({
        message: "Forbidden",
      });
    }
  };
};

export const isAuthenticated = (...roles) => {
  return (req, res, next) => {
    const accessToken =
      req.cookies.accessToken || req.body.accessToken || undefined;
    jwt.verify(accessToken, process.env.JWT_SECRET, (err, decodedToken) => {
      req.auth = false;
      if (!err) {
        req.user = decodedToken.user;
        if (roles.length == 0 || roles.includes(req.user.role)) {
          req.auth = true;
        }
      }
    });
    next();
  };
};

export const authUser = (req, res, next) => {
  const accessToken =
    req.cookies.accessToken || req.body.accessToken || undefined;
  jwt.verify(accessToken, process.env.JWT_SECRET, (err, decodedToken) => {
    if (!err) {
      req.user = decodedToken.user;
      next();
    } else {
      res.redirect("/api/auth/refresh");
    }
  });
};

export const multipartForm = (req, res, next) => {
  const form = formidable({ multiples: true });
  if (req.method == "POST") {
    form.parse(req, (err, fields, files) => {
      if (!err) {
        req.body = fields;
        req.files = files;
      }
      next();
    });
  } else {
    next();
  }
};

export const FormAccessControl = bp(async (req, res, next) => {
  const userId = req.user.id;
  const formId = req.params.id;
  const form = await Forms.findByPk(formId);
  if (!form) {
    res.status(404).json({ message: "The Form Doesn't Exist" });
    return;
  }
  if (form.owner == userId) {
    req.accessLevel = "owner";
    next();
    return;
  } else if (form.sharedTo.includes(req.user.email)) {
    req.accessLevel = "viewer";
    if (req.method === "GET") {
      next();
    } else {
      res
        .status(401)
        .json({ message: "You Don't have access to the particular resource" });
    }
    return;
  }

  res
    .status(401)
    .json({ message: "You Don't have access to the particular resource" });
});
