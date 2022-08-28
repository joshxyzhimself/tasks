
// @ts-check


import React from 'react';


/**
 * @type {import('./Static404').Static404}
 */
export const Static404 = () => {

  React.useEffect(() => {
    document.title = '404';
  }, []);

  return (
    <div className="p-4 flex flex-col justify-center items-center">
      <div className="pt-4 px-4 text-left text-lg md:text-xl lg:text-2xl font-bold">
        404
      </div>
      <div className="pb-4 px-4 text-left text-base font-normal text-slate-400">
        Not Found
      </div>
      <div className="w-full sm:w-3/4 md:w-1/2 lg:w-1/3">
        <div className="py-1 text-left text-sm font-normal">
          The page you are trying to access is not found.
        </div>
        <div className="py-1 text-left text-sm font-normal">
          Try checking the link if you are at the right place.
        </div>
        <div className="py-1 text-left text-sm font-medium text-slate-400">
          { `${window.location.protocol}//${window.location.host}${window.location.pathname}`}
        </div>
      </div>
    </div>
  );
};