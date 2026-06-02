import { extendTailwindMerge } from 'tailwind-merge';

const twMerge = extendTailwindMerge({});

export function cx(...args) {
  return twMerge(args.filter(Boolean).join(' '));
}
