// Hook ripple to button
//mdc.ripple.MDCRipple.attachTo(document.querySelector(".mdc-button"));

const topAppBarElement = document.querySelector(".mdc-top-app-bar");

mdc.topAppBar.MDCTopAppBar.attachTo(topAppBarElement);
mdc.textField.MDCTextField.attachTo(document.querySelector('.mdc-text-field'));

const chipSetEl = document.querySelector('.mdc-chip-set');
mdc.chips.MDCChip.attachTo(chipSetEl);