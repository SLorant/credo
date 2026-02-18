// Extend the Number prototype to add map function
declare global {
  interface Number {
    map(
      in_min: number,
      in_max: number,
      out_min: number,
      out_max: number,
    ): number;
  }
}

Number.prototype.map = function (
  in_min: number,
  in_max: number,
  out_min: number,
  out_max: number,
): number {
  return (
    (((this as number) - in_min) * (out_max - out_min)) / (in_max - in_min) +
    out_min
  );
};

export {};
