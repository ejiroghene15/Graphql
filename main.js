window.onload = () => {
	const URL = "https://api.github.com/graphql";
	let Token = "6b8b47eb31b9e308b18e8268926bcb9e84dea7b4";
	let repos = document.querySelector("#repos");
	let avatar = document.querySelectorAll(".avatar");
	let fullname = document.querySelector("#fullname");
	let username = document.querySelector("#username");
	let bio = document.querySelector("#bio");
	let badge = document.querySelector("#badge");

	fetch(URL, {
		method: "POST",
		headers: {
			Authorization: `Token ${Token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			query: `
      {
       user(login: "ejiroghene15") {
        name
        login
        bio
        avatarUrl(size: 50)
        repositories(first: 2, orderBy: {field: UPDATED_AT, direction: DESC}) {
          nodes {
            name
            description
            updatedAt
            stargazerCount
            forkCount
            url
            primaryLanguage {
              name
              color
            }
          }
          totalCount
        }
      }
    }
      `,
		}),
	})
		.then((res) => res.json())
		.then(({ data }) => {
			let { user } = data;
			avatar.forEach((img) => {
				img.src = user.avatarUrl;
			});

			fullname.textContent = user.name;
			username.textContent = user.login;
			bio.textContent = user.bio;
			badge.textContent = user.repositories.totalCount;

			console.log(user.login);
			user.repositories.nodes.forEach((repository) => {
				repos.insertAdjacentHTML("beforeEnd", repoTemplate(repository));
			});
			// console.log(user.name);
		});

	let repoTemplate = ({
		name,
		description,
		primaryLanguage,
		forkCount,
		stargazerCount,
		updatedAt,
		url,
	}) => {
		let year = new Date(updatedAt).getFullYear();
		let month = new Date(updatedAt).getUTCMonth();
		let day = new Date(updatedAt).getUTCDate();
		return `
        <div class="repo-list">
						<a href="${url}" class="repo-name">${name}</a>
						<div class="repo-desc">
							<div class="desc">
								<p>
									${description}
								</p>
								<p class="add-repo-info">
									<span>
										<span class="lang-color" style='background-color: ${
											primaryLanguage.color
										}'></span>
										<span class="lang">${primaryLanguage.name}</span>
									</span>
									${
										forkCount !== 0
											? `<span class="fork_n_star">
										<img src="./svgs/fork.svg" alt="" />
										<span class="count">${forkCount}</span>
                  </span>`
											: ""
									}
                  ${
										stargazerCount !== 0
											? `<span class="fork_n_star">
										<img src="./svgs/star.svg" alt="" />
										<span class="count">${stargazerCount}</span>
                  </span>`
											: ""
									}
                  <span>
                    Updated on
										<span>${new Date(Date.UTC(year, month, day)).toLocaleDateString(undefined, {
											month: "short",
											day: "numeric",
											year:
												year == new Date().getFullYear()
													? undefined
													: "numeric",
										})}</span>
                  </span>

								</p>
							</div>
							<button class="star">
								<img src="./svgs/star.svg" alt="" /> Star
							</button>
						</div>
					</div>
        `;
	};
};
