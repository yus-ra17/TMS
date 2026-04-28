interface Props {
  message?: string;
}

export function ErrorMessage({ message = 'Something went wrong' }: Props) {
  return <div className="error-box">{message}</div>;
}
