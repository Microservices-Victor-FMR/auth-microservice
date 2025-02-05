export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    private readonly password_hash: string,
    public readonly role: string,
    public readonly is_verify: boolean,
    public readonly is_deleted: boolean,
    public readonly created_at: Date,
    public readonly updated_at: Date,
  ) {}

  getPassword() {
    return this.password_hash;
  }
}
