module.exports = {
  extends: ['stylelint-config-standard-scss', 'stylelint-config-recess-order'],
  rules: {
    'selector-class-pattern': null,
    'declaration-no-important': true,
    'max-nesting-depth': 3
  }
};
