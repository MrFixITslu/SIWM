import test from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import { verifyWarehouseDestructiveAction } from '../security-destructive-policy.ts';

test('Destructive warehouse operations deny predictable confirmation phrases and passwordless identities', async () => {
  const actor={id:'user-1',warehouseId:'warehouse-1'};
  const noHash={id:'user-1',passwordHash:null};
  for (const phrase of ['confirm','reset','oauth','user@example.invalid','']) {
    assert.equal(await verifyWarehouseDestructiveAction(actor,noHash,'admin',phrase),false);
  }
});
test('Only a matching admin can perform an actual password step-up', async () => {
  const actor={id:'user-1',warehouseId:'warehouse-1'};
  const user={id:'user-1',passwordHash:await bcrypt.hash('synthetic-unpredictable-authentication-password',10)};
  assert.equal(await verifyWarehouseDestructiveAction(actor,user,'admin','synthetic-unpredictable-authentication-password'),true);
  assert.equal(await verifyWarehouseDestructiveAction(actor,user,'member','synthetic-unpredictable-authentication-password'),false);
  assert.equal(await verifyWarehouseDestructiveAction({id:'user-2',warehouseId:'warehouse-1'},user,'admin','synthetic-unpredictable-authentication-password'),false);
  assert.equal(await verifyWarehouseDestructiveAction(actor,user,'admin','incorrect'),false);
});
