
// @ts-check


import React from 'react';


/**
 * @type {import('./Static403').Static403}
 */
export const Static403 = () => {

  React.useEffect(() => {
    document.title = '403';
  }, []);

  return (
    <div className="p-4 flex flex-col justify-center items-center">
      <div className="pt-4 px-4 text-left text-lg md:text-xl lg:text-2xl font-bold">
        403
      </div>
      <div className="pb-4 px-4 text-left text-base font-normal text-slate-400">
        Forbidden
      </div>
      <div className="w-full sm:w-3/4 md:w-1/2 lg:w-1/3">
        <div className="py-1 text-left text-sm font-normal">
          The page you are trying to access is not allowed.
        </div>
        <div className="py-1 text-left text-sm font-normal">
          Try refreshing the page, then check if you are already signed-in or signed-out.
        </div>
        <div className="py-1 text-left text-sm font-medium text-slate-400">
          { `${window.location.protocol}//${window.location.host}${window.location.pathname}`}
        </div>
      </div>
    </div>
  );
};