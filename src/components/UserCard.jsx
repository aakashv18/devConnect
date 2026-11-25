import Avatar from "./Avatar";

const UserCard = ({ user, actions }) => {
  const details = [user.age, user.gender].filter(Boolean).join(", ");

  return (
    <div className="card bg-base-200 w-80 shadow-md">
      <figure className="pt-10">
        <Avatar user={user} size="w-28" />
      </figure>
      <div className="card-body items-center text-center">
        <h2 className="card-title">
          {user.firstName} {user.lastName}
        </h2>
        {user.title && <p className="text-primary font-medium">{user.title}</p>}
        {details && <p className="capitalize opacity-70">{details}</p>}
        {user.about && <p className="line-clamp-4 text-sm">{user.about}</p>}
        {user.skills?.length > 0 && (
          <div className="mt-2 flex flex-wrap justify-center gap-1">
            {user.skills.map((skill) => (
              <span key={skill} className="badge badge-outline badge-sm">
                {skill}
              </span>
            ))}
          </div>
        )}
        {actions && <div className="card-actions mt-4">{actions}</div>}
      </div>
    </div>
  );
};

export default UserCard;
