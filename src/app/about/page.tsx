export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="flex gap-1.5 mb-6">
        <div className="h-8 w-2 rounded-full bg-blue-500" />
        <div className="h-8 w-2 rounded-full bg-emerald-500" />
        <div className="h-8 w-2 rounded-full bg-red-500" />
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">About CommonGround</h1>

      <div className="prose prose-gray max-w-none">
        <p className="text-lg text-gray-600 leading-relaxed mb-6">
          CommonGround is a news platform built on a simple idea: you deserve to know
          what actually happened before hearing what anyone thinks about it.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">How It Works</h2>
        <p className="text-gray-600 mb-4">
          For every major policy story, CommonGround presents four things:
        </p>
        <ul className="space-y-3 mb-6">
          <li className="flex gap-3">
            <span className="h-6 w-1.5 rounded-full bg-emerald-500 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-gray-900">The Facts (Common Ground)</strong>
              <span className="text-gray-600"> &mdash; What objectively happened. No spin, no emotional framing.</span>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="h-6 w-1.5 rounded-full bg-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-gray-900">Left Perspective</strong>
              <span className="text-gray-600"> &mdash; How progressive voices and Democratic-leaning outlets frame the story.</span>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="h-6 w-1.5 rounded-full bg-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-gray-900">Right Perspective</strong>
              <span className="text-gray-600"> &mdash; How conservative voices and Republican-leaning outlets frame the story.</span>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="h-6 w-1.5 rounded-full bg-gray-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-gray-900">Implications</strong>
              <span className="text-gray-600"> &mdash; What this could mean for you, without fear or sensationalism.</span>
            </div>
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">What We Cover</h2>
        <p className="text-gray-600 mb-4">
          CommonGround focuses on US policy and systemic issues: legislation, healthcare,
          education, technology, the economy, national security, and more. We do not cover
          local crime, celebrity gossip, or stories designed to provoke fear rather than inform.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Our Sources</h2>
        <p className="text-gray-600 mb-4">
          We pull from a wide range of outlets across the political spectrum, including
          AP, Reuters, NPR, CNN, Fox News, Wall Street Journal, The Hill, Politico,
          National Review, and many more. Our AI analyzes coverage from multiple angles
          to ensure balanced representation.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Our Mission</h2>
        <p className="text-gray-600">
          We believe informed citizens make better decisions. CommonGround exists to help
          you understand what is happening in your country without being manipulated by
          partisan framing. We are not left. We are not right. We are the ground truth.
        </p>
      </div>
    </div>
  );
}
