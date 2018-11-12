export const makeActionCreator = (type, ...argNames) => {
  return function(...args) {
    let action = { type };
    argNames.forEach((arg, index) => {
      action[arg] = args[index];
    });
    return action;
  };
};
