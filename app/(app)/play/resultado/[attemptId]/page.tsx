import ResultView from '@/components/play/result-view';

export default async function ResultPage({ params }: { params: Promise<{ attemptId: string }> }) {
  const { attemptId } = await params;
  return <ResultView attemptId={attemptId} />;
}
