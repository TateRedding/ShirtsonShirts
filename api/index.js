require("dotenv").config();

const express = require("express");
const apiRouter = express.Router();
const jwt = require("jsonwebtoken");
const { getUserById } = require("../db/users.js");
const { JWT_SECRET } = process.env;

apiRouter.use(async (req, res, next) => {
    const prefix = "Bearer ";
    const auth = req.header("Authorization");

    if (!auth) {
        next();
    } else if (auth.startsWith(prefix)) {
        const token = auth.slice(prefix.length);

        try {
            const { id } = jwt.verify(token, JWT_SECRET);

            if (id) {
                req.user = await getUserById(id);
                next();
            }
        } catch (err) {
            next(err);
        }
    } else {
        next({
            name: "AuthorizationHeaderError",
            message: `Authorization token must start with ${prefix}`,
        });
    };
});

apiRouter.use("/carts", require("./carts"));
apiRouter.use("/cartItemStyles", require("./cartItemStyles"));
apiRouter.use("/categories", require("./categories"));
apiRouter.use("/items", require("./items"));
apiRouter.use("/itemStyles", require("./itemStyles.js"));
apiRouter.use("/itemStyleSizes", require("./itemStyleSizes.js"));
apiRouter.use("/sizes", require("./sizes"));
apiRouter.use("/users", require("./users"));

module.exports = apiRouter;