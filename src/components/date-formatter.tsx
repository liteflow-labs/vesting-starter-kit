import { format } from "date-fns";

export default function DateFormatter({
  children,
  time,
}: {
  children: Date;
  time?: boolean;
}) {
  return (
    <>
      {format(new Date(children), "MMM d, yyyy")}{" "}
      {time && (
        <span className="text-muted-foreground">
          {format(new Date(children), "h:mm a")}
        </span>
      )}
    </>
  );
}
