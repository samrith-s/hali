/**
 * Based on cloning and merging mechanism written by @Eunomaniac on GitHub (https://gist.github.com/ahtcx/0cd94e62691f539160b32ecda18af3d6?permalink_comment_id=4058994#gistcomment-4058994)
 */

export function clone<T>(obj: T, isStrictlySafe = false) {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (err) {
    if (isStrictlySafe) {
      throw new Error(err as string);
    }
    return { ...obj };
  }
}

export function merge<T = Record<string | number, any>>(
  source: any,
  target: any,
  { isMutatingOk = false, isStrictlySafe = false } = {}
) {
  target = isMutatingOk ? target : clone(target, isStrictlySafe);
  for (const [key, val] of Object.entries(source as any)) {
    if (val !== null && typeof val === `object`) {
      if (target[key] === undefined) {
        target[key] = new (val as any).__proto__.constructor();
      }

      target[key] = merge(target[key], val, {
        isMutatingOk: true,
        isStrictlySafe,
      });
    } else {
      target[key] = val;
    }
  }
  return target;
}
