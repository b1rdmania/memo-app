import { useState } from 'react';
import { Landing } from './components/Landing';
import { Result } from './components/Result';
import { About } from './components/About';
import type { Audience, MemoOutput } from './lib/types';
import type { SampleKey } from './lib/samples';

interface ResultState {
  memo: string;
  audience: Audience;
  output: MemoOutput;
  source: 'sample' | 'live';
  sampleKey?: SampleKey;
}

type View = 'landing' | 'result' | 'about';

function App() {
  const [view, setView] = useState<View>('landing');
  const [result, setResult] = useState<ResultState | null>(null);

  if (view === 'about') {
    return <About onHome={() => setView(result ? 'result' : 'landing')} />;
  }

  if (view === 'result' && result) {
    return (
      <Result
        memo={result.memo}
        audience={result.audience}
        output={result.output}
        source={result.source}
        sampleKey={result.sampleKey}
        onBack={() => {
          setResult(null);
          setView('landing');
        }}
        onAbout={() => setView('about')}
        onSwap={(audience, output) =>
          setResult({ ...result, audience, output })
        }
      />
    );
  }

  return (
    <Landing
      onResult={(memo, audience, output, source, sampleKey) => {
        setResult({ memo, audience, output, source, sampleKey });
        setView('result');
      }}
      onAbout={() => setView('about')}
    />
  );
}

export default App;
