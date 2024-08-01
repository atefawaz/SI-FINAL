import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node,
        module: "writable",
        require: "writable",
        process: "writable",
        ...globals.jest,  // Add Jest globals here
      },
    },
    rules: {
      "no-console": "off",
      "no-restricted-syntax": [
        "error",
        {
          selector: "ForInStatement",
          message: "for..in loops are not allowed",
        },
        {
          selector: "LabeledStatement",
          message: "Labels are not allowed",
        },
        {
          selector: "WithStatement",
          message: "with statements are not allowed",
        },
      ],
    },
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
    },
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: globals.browser,
    },
  },
  pluginJs.configs.recommended,
];
