import { test } from 'ava';
import Coder from '../src/util/coder';

test('encode/ decode message to AES with key', async (t) => {
  const message = 'Hello world!';
  const key = 'secret';
  const encode = Coder.encode(message, key);
  const result = Coder.decode(encode, key);
  t.is(message, result);
});
test('encode/ decode message to AES with Invalid key', async (t) => {
  const message = 'Hello world!';
  const key = 'secret';
  const encode = Coder.encode(message, key);
  const result = Coder.decode(encode, 'invalid');
  t.not(result, message);
});

