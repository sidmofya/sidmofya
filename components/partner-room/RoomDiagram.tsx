import { partnerRoomCopy } from "./content";

export default function RoomDiagram() {
  return (
    <div aria-label="Partner Room participants">
      {partnerRoomCopy.room.diagram.map((group) => (
        <div key={group.label}>
          <p>{group.label}</p>
          {group.label === "5 INVESTORS" && (
            <div aria-hidden="true">
              {[1, 2, 3, 4, 5].map((node) => <span key={node} />)}
            </div>
          )}
          <p>{group.description}</p>
        </div>
      ))}
    </div>
  );
}
