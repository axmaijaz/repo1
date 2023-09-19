export {}; // this file needs to be a module
String.prototype.isNullOrEmpty = function (this: string): boolean {
    return !this;
};
String.prototype.getShortCode = function getInitials(this: string): string {
  const names = this.split(" ");
  if (names.length === 1) {
    // Case where only one name is provided
    return names[0].slice(0, 2).toUpperCase();
  } else if (names.length === 2) {
    // Case where first and last names are provided
    const firstName = names[0].charAt(0).toUpperCase();
    const lastName = names[1].charAt(0).toUpperCase();
    return firstName + lastName;
  } else {
    // Case where there are more than two names (middle names, etc.)
    const firstName = names[0].charAt(0).toUpperCase();
    const lastName = names[names.length - 1].charAt(0).toUpperCase();
    return firstName + lastName;
  }
}
