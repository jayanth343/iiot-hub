import { lazy, Suspense } from 'react';

const BytecodeLoader = lazy(() => import('MyContractBytecode.bin'));

const LazyBytecodeLoader = () => {
  return (
    <Suspense fallback={<div>Loading bytecode...</div>}>
      <BytecodeComponent />
    </Suspense>
  );
};

const BytecodeComponent = () => {
  const bytecode = require('MyContractAbi.json');
  return <>{bytecode}</>;
};

export { LazyBytecodeLoader, BytecodeComponent };