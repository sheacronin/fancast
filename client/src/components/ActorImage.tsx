import { Image } from 'react-bootstrap';
import defaultActorImageAlt from '../assets/default_actor_alt.jpg';
import type { Actor } from '../types';

interface ActorImageProps {
  actor: Actor;
  thumbnail?: boolean;
  width?: 'auto' | 50 | 75 | 100;
}

export const ActorImage = ({
  actor: { imageLink, name },
  thumbnail = false,
  width = 'auto',
}: ActorImageProps) => {
  return (
    <Image
      src={imageLink || defaultActorImageAlt}
      alt={name}
      rounded={!thumbnail}
      thumbnail={thumbnail}
      className={`w-${width}`}
    />
  );
};
