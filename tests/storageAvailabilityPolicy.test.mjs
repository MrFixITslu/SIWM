import test from 'node:test';
import assert from 'node:assert/strict';
import { assertStorageFallbackAllowed } from '../storageAvailabilityPolicy.ts';

test('Postgres failure fails closed in production',()=> {
  assert.throws(()=>assertStorageFallbackAllowed(true),/refusing in-memory fallback/);
});
test('Development preview may use nonpersistent demo storage',()=> {
  assert.doesNotThrow(()=>assertStorageFallbackAllowed(false));
});
