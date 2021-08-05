module.exports = {
  images: {
    domains: ["34.87.84.83", "storage.googleapis.com"],
    loader: "imgix",
    path: "",
  },
  exportPathMap: function () {
    return {
      "/": { page: "/" },
    };
  },
};
