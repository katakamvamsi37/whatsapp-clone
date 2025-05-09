package com.vamsi.repository;

import java.util.List;

import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.vamsi.model.Chat;
import com.vamsi.model.User;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Integer>
{
	@Query("select c from Chat c join c.users u where u.id =:userId")
	public List<Chat> findChatsByUserId(@Param("userId") Integer userId);

	@Query("select c from Chat c join c.users u where u.id =:userId")
	public Chat findChatByUserId(@Param("userId") Integer userId);
	
	@Query("select c from Chat c where c.isGroup=false and :user member of c.users And :reqUser member of c.users")
	public Chat findSingleChatByUserId(@Param("user") User user,@Param("reqUser")User reqUser);

	Chat findChatById(@NotNull Integer id);

	void deleteChatById(@NotNull Integer id);
}
