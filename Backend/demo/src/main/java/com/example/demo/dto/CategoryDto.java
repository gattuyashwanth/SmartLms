package com.example.demo.dto;

public class CategoryDto {
    private Long id;
    private String name;
    private String description;
    private long courseCount;

    public CategoryDto() {}

    public CategoryDto(Long id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public long getCourseCount() { return courseCount; }
    public void setCourseCount(long courseCount) { this.courseCount = courseCount; }
}
