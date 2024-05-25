async function findTest(query) {
  //temp
  return [
    {
      "name": "2024학년도 1학기 중간고사 3학년 미적분",
      "id": "aaaaa"
    },
    {
      "name": "2023학년도 1학기 중간고사 3학년 미적분",
      "id": "bbbbb"
    },
  ]
}

async function getTestInfo(id) {
  //temp
  return {
    "name": "시험이름",
    "files": [
      {
        "name": "file1",
        "url": "https://drive.usercontent.google.com/u/0/uc?id=1x9OIsmhFbLxH48D2tyEH91N0dPywKy8O&export=download"
      },
      {
        "name": "file2",
        "url": "https://drive.usercontent.google.com/u/0/uc?id=1x9OIsmhFbLxH48D2tyEH91N0dPywKy8O&export=download"
      }
    ]
  }
}

export { findTest, getTestInfo }