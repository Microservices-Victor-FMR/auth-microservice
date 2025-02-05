import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class Bcrypt {
    async hashPassword(password: string) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }

    async comparePassword(password: string, hash: string) {
        const isMatch = await bcrypt.compare(password, hash);
        return isMatch;
    }
}
