import { useState } from 'react';
import { Landing } from './components/Landing';
import { Result } from './components/Result';
import type { Audience, MemoOutput } from './lib/types';

interface ResultState {
  memo: string;
  audience: Audience;
  output: MemoOutput;
  source: 'sample' | 'live';
}

function App() {
  const [result, setResult] = useState<ResultState | null>(null);

  if (result) {
    return (
      <Result
        memo={result.memo}
        audience={result.audience}
        output={result.output}
        source={result.source}
        onBack={() => setResult(null)}
      />
    );
  }

  return (
    <Landing
      onResult={(memo, audience, output, source) =>
        setResult({ memo, audience, output, source })
      }
    />
  );
}

export default App;
