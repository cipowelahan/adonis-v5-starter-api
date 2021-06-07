import Permission from 'App/Modules/Role/Repositories/Entities/Permission'

class Authorization {
  private async run(user_id: number, permissions: string[]): Promise<string[]> {
    const results = await Permission
      .query()
      .whereHas('roles', (query) => {
        query.whereHas('users', (subQuery) => {
          subQuery.where('id', user_id)
        })
      })
      .whereIn('name', permissions)

    return results.map((permission) => {
      return permission.name
    })
  }

  /** assumes array elements are primitive types
  * check whether 2 arrays are equal sets.
  * @param  {} a1 is an array
  * @param  {} a2 is an array
  * https://stackoverflow.com/questions/6229197/how-to-know-if-two-arrays-have-the-same-values/55614659#55614659
  * fix probelm on O(nlog(n))
  */
  // private checkSameArray(a1, a2): boolean {
  //   const superSet = {};
  //   for (const i of a1) {
  //     const e = i + typeof i;
  //     superSet[e] = 1;
  //   }

  //   for (const i of a2) {
  //     const e = i + typeof i;
  //     if (!superSet[e]) {
  //       return false;
  //     }
  //     superSet[e] = 2;
  //   }

  //   for (let e in superSet) {
  //     if (superSet[e] === 1) {
  //       return false;
  //     }
  //   }

  //   return true;
  // }

  public async can(user_id: number, permission: string | string[]): Promise<boolean> {
    var permissions

    if (typeof permission === "string") {
      permissions = [permission]
    }
    else {
      permissions = permission
    }

    const results = await this.run(user_id, permissions)
    for (let i = 0; i < permissions.length; i++) {
      if (!results.includes(permissions[i])) {
        return false
      }
    }

    return true
  }

  public async canAny(user_id: number, permissions: string[]): Promise<boolean> {
    const results = await this.run(user_id, permissions)

    if (results.length != 0) {
      return true
    }

    return false
  }
}

export default new Authorization()