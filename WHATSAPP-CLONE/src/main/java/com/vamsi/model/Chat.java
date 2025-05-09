package com.vamsi.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class Chat 
{
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer id;
	private String chat_name;
	private String chat_image;

	@ManyToMany(fetch = FetchType.EAGER)
	private Set<User> admins = new HashSet<>();
	
	
	@Column(name="is_group")
	private boolean isGroup;
	
	@JoinColumn(name = "created_by")
	@ManyToOne
	private User createdBy;

	@ManyToMany(fetch = FetchType.EAGER)
	private Set<User> users = new HashSet<>();
	@OneToMany(mappedBy = "chat", cascade = CascadeType.ALL, orphanRemoval = true,fetch = FetchType.EAGER)
	private List<Message> messages;
	
	@Override
	public String toString() {
	    return "Chat{" +
	           "id=" + id +
	           ", chat_name='" + chat_name + '\'' +
	           ", isGroup=" + isGroup +
	           '}'; // Exclude all relationships
	}

}
