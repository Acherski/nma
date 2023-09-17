export const mapBackendResponseToStringArray = (res: string): string[] => {
  const list: string[] = [];
  res
    .split('|')
    .slice(4)
    .map(item => list.push(item));

  return list;
};
