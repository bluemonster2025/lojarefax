interface Props {
  className: string;
}

export const Skeleton = ({ className }: Props) => {
  const getClassName = () => `animate-pulse bg-skeleton ${className}`;

  return <div className={getClassName()} />;
};
