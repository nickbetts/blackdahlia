export type TrustPoint = {
  icon: React.ReactNode;
  title: string;
  body: string;
};

export function TrustCards({ points }: { points: TrustPoint[] }) {
  return (
    <div className="revealGrid">
      {points.map((point, i) => (
        <div key={i} className="revealCard">
          <div className="revealCardInner">
            <div className="revealCardIcon">{point.icon}</div>
            <div>
              <h3 className="revealCardTitle">{point.title}</h3>
              <p className="revealCardBody">{point.body}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
