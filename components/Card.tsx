import { ReactElement } from 'react';

interface CardProps {
  icon: ReactElement;
  title: string;
  description: string;
  imagePosition?: 'top' | 'left';
}

export default function Card({ icon, title, description, imagePosition = 'top' }: CardProps) {
  const isLeft = imagePosition === 'left';

  return (
    <div
      className={`bg-white rounded-lg p-6 shadow-lg flex gap-4 cursor-pointer ${
        // Changed items-center to items-start for the left variant
        isLeft ? 'flex-row text-left items-start' : 'flex-col text-center items-center'
        }`}
    >
      {/* Image Container */}
      <div className={isLeft ? 'w-1/4 flex justify-start pt-1' : 'w-auto'}>
        {icon}
      </div>

      {/* Content Container */}
      <div className={isLeft ? 'w-3/4 flex flex-col gap-1' : 'flex flex-col items-center gap-4'}>
        <h3 className="text-gradient-brand text-xl font-semibold">
          {title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
