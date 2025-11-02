// global.d.ts
import { ConfirmationResult } from 'firebase/auth';

declare global {
  var confirmationResult: ConfirmationResult;
}
