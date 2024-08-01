import { Switch } from '@headlessui/react';

interface Props {
    enabled: boolean;
    setEnabled?: (enabled: boolean) => void;
    textone?:string;
    texttwo?:string;
}

export default function Switcher({ enabled, setEnabled, textone = 'Monthly', texttwo = 'Annually' }:Props) {
  return (
      <Switch
        checked={enabled}
        onChange={setEnabled}
        className={`isolate relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 grid grid-cols-2
          text-xs ring-1 ring-gray-200 ring-offset-2 font-medium cursor-pointer`}
      >
      <span className={`${enabled ? 'text-neutral-600' : 'text-white'} place-self-center p-2 px-4`}>{textone}</span>
      <span className={`${enabled ? 'text-white' : 'text-neutral-600'} place-self-center p-2 px-4`}>{texttwo}</span>
        <span className="sr-only">{`${textone}/${texttwo}`}</span>
        <span
          aria-hidden="true"
          className={`${enabled ? 'translate-x-full' : 'translate-x-0'}
            absolute pointer-events-none inline-block h-full w-1/2 transform rounded-full bg-blue-600 ring-0 transition duration-200 ease-in-out -z-10`}
        />
      </Switch>
  );
}