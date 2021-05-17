export default class Role {
  public static SUPER_ADMIN = 1;
  public static ADMIN = 2;
  public static STAFF = 3;
  public static COSTUMER = 4;

  public static toLabels(): Object {
    return {
      [Role.SUPER_ADMIN]: "Super Admin",
      [Role.ADMIN]: "Admin",
      [Role.ADMIN]: "Admin",
      [Role.STAFF]: "Staff",
      [Role.COSTUMER]: "Costumer",
    }
  }

  public static accessStaff(): Array<number> {
    return [
      Role.SUPER_ADMIN,
      Role.ADMIN,
      Role.STAFF
    ]
  }

  public static accessAdmin(): Array<number> {
    return [
      Role.SUPER_ADMIN,
      Role.ADMIN
    ]
  }

  public static accessUserManagement(): Array<number> {
    return [
      Role.SUPER_ADMIN
    ]
  }

  public static accessCreateTicket(): Array<number> {
    return [
      Role.COSTUMER
    ]
  }

  public static availableUserStore(): Array<number> {
    return [
      Role.ADMIN,
      Role.STAFF
    ]
  }

}