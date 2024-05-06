'use client';

import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { useFormState, useFormStatus } from 'react-dom';
import { authenticate } from '@/lib/actions';
import Link from 'next/link';

export default function LoginForm() {
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);

  return (
    <form className="w-full h-[80vh] flex items-center justify-center flex-col" action={dispatch}>
      <div className="w-full md:w-1/3 rounded-lg bg-stone-700 px-6 pb-4 pt-8">
        <h1 className="mb-3 text-2xl font-bold text-center">
          Login
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 block font-medium"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border-2 border-gray-400 bg-transparent text-gray-50 py-4 pl-10 placeholder:text-gray-400"
                id="email"
                type="text"
                name="email"
                placeholder="Enter your email address"
              />
              <AtSymbolIcon className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400 peer-focus:text-gray-50" />
            </div>
            {errorMessage?.errors?.email && (
              <div className='flex gap-2 items-center mt-2'>
                <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
                <p className="text-red-400">{errorMessage.errors.email}</p>
              </div>
            )}
          </div>
          <div className="mt-4">
            <label
              className="mb-3 block font-medium"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border-2 border-gray-400 bg-transparent text-gray-50 py-4 pl-10 placeholder:text-gray-400"
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400 peer-focus:text-gray-50" />
            </div>
            {errorMessage?.errors?.password && (
              <div className='flex gap-2 items-center mt-2'>
                <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
                <p className="text-red-400">{errorMessage.errors.password}</p>
              </div>
            )}
          </div>
        </div>
        <LoginButton />
        <div className="flex h-8 items-end space-x-1">
          <div
            className="flex h-8 items-end space-x-1"
            aria-live="polite"
            aria-atomic="true"
          >
            {errorMessage?.message && (
              <div className='flex gap-2 items-center'>
                <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
                <p className="text-red-400">{errorMessage.message}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/3 mt-8 flex justify-center">
            <Link href="/register" className="text-neutral-400 hover:text-neutral-200 transition underline">Create an account</Link>
      </div>
    </form>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <button className="mt-6 bg-neutral-900 px-6 py-4 w-full flex items-center rounded-md font-bold hover:bg-neutral-800 transition" aria-disabled={pending}>
      Log in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
    </button>
  );
}
